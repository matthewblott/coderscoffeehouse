---
layout: post
title:  "Roll Your Own Data Access Layer"
date:   2015-02-06 21:53:00
categories: web orms
---
This is a follow up to a previous post I did about a website I'm upgrading.

You have a website that you manage that wasn't written by you and wasn't the best piece of software ever written to start with. But now it's old and needs upgrading. The problem is it "works" and rewriting it is not a priority. But badly written software often isn't modular and partial upgrading can be difficult. Babysteps are required but small steps will eventually take you a long way and the journey has to start somewhere.

One of the earlier tasks I like to achieve with this type of project is getting a good handle on the data layer. It's often a mixture of inline SQL and stored procedures with no consistency between how each is called - some methods just execute a concatenated string while others correctly append paramaters to a command object. But even with the correct approach you often end up with a lot of boiler plate code like the following:

{% highlight vbnet linenos %}

Dim cnnConn As SqlConnection
Dim cmdReturn As SqlCommand
Dim intStatus As Integer
Dim strCmd As String

cnnConn = New SqlConnection(System.Configuration.ConfigurationManager.ConnectionStrings("LocalSqlServer").ConnectionString)
cnnConn.Open()

strCmd = "prcTemplateOrderInsert"

cmdReturn = New SqlCommand

With cmdReturn
  .Connection = cnnConn
  .CommandText = strCmd
  .CommandType = System.Data.CommandType.StoredProcedure
  .Parameters.Add("@ID", System.Data.SqlDbType.Int)
  .Parameters("@ID").Value = intID
  .Parameters("@ID").Direction = System.Data.ParameterDirection.Output
  .Parameters.Add("@OrderType", System.Data.SqlDbType.TinyInt)
  .Parameters("@OrderType").Value = intType
  .Parameters.Add("@ClientAccountCode", System.Data.SqlDbType.VarChar)
  .Parameters("@ClientAccountCode").Value = strClientAccountCode
  .Parameters.Add("@HeadOfficeCode", System.Data.SqlDbType.VarChar)
  .Parameters("@HeadOfficeCode").Value = strHeadOfficeCode
  .Parameters.Add("@TemplateID", System.Data.SqlDbType.Int)
  .Parameters("@TemplateID").Value = intTemplate
  .Parameters.Add("@ClientStockCode", System.Data.SqlDbType.VarChar)
  .Parameters("@ClientStockCode").Value = strClientStockCode
  .Parameters.Add("@UserID", System.Data.SqlDbType.Int)
  .Parameters("@UserID").Value = intUser
  .Parameters.Add("@ForUserID", System.Data.SqlDbType.Int)
  .Parameters("@ForUserID").Value = intUserFor
  .Parameters.Add("@OrderQty", System.Data.SqlDbType.Int)
  .Parameters("@OrderQty").Value = intQty
  .Parameters.Add("@OrderValue", System.Data.SqlDbType.Float)
  .Parameters("@OrderValue").Value = dblValue
  .Parameters.Add("@FAO", System.Data.SqlDbType.VarChar)
  .Parameters("@FAO").Value = strFAO
  .Parameters.Add("@ClientLocationCode", System.Data.SqlDbType.VarChar)
  .Parameters("@ClientLocationCode").Value = strClientLocationCode
  .Parameters.Add("@DeliveryAddress", System.Data.SqlDbType.VarChar)
  .Parameters("@DeliveryAddress").Value = strDelAdd
  .Parameters.Add("@ClientOrderRef", System.Data.SqlDbType.VarChar)
  .Parameters("@ClientOrderRef").Value = strClientOrderRef
  .Parameters.Add("@CostCentreCode", System.Data.SqlDbType.VarChar)
  .Parameters("@CostCentreCode").Value = strCostCentreCode
  .Parameters.Add("@SpecialInstructions", System.Data.SqlDbType.VarChar)
  .Parameters("@SpecialInstructions").Value = strSpecInst
  .Parameters.Add("@TextChange", System.Data.SqlDbType.Bit)
  .Parameters("@TextChange").Value = blnTextChange
  .Parameters.Add("@TextChangeDetail", System.Data.SqlDbType.NText)
  .Parameters("@TextChangeDetail").Value = strTextChange
  .Parameters.Add("@Reverse", System.Data.SqlDbType.Bit)
  .Parameters("@Reverse").Value = blnReverse
  .Parameters.Add("@Litho", System.Data.SqlDbType.Bit)
  .Parameters("@Litho").Value = isLitho
  .Parameters.Add("@Auth", System.Data.SqlDbType.Bit)
  .Parameters("@Auth").Value = blnAuth
  .Parameters.Add("@IPAdd", System.Data.SqlDbType.VarChar)
  .Parameters("@IPAdd").Value = strIP
  .Parameters.Add("@SPStatus", System.Data.SqlDbType.Int)
  .Parameters("@SPStatus").Value = intStatus
  .Parameters("@SPStatus").Direction = System.Data.ParameterDirection.Output
  .Parameters.Add("@NewOrder", System.Data.SqlDbType.Bit)
  .Parameters("@NewOrder").Value = blnNewOrder
  .Parameters("@NewOrder").Direction = System.Data.ParameterDirection.Output
  .Parameters.Add("@HoldOrder", System.Data.SqlDbType.Bit)
  .Parameters("@HoldOrder").Value = blnHoldOrder
  .Parameters.Add("@Intervention", System.Data.SqlDbType.Bit)
  .Parameters("@Intervention").Value = blnIntervention
  .Parameters.Add("@SiteID", System.Data.SqlDbType.Int)
  .Parameters("@SiteID").Value = SiteID
  .ExecuteNonQuery()
  intID = .Parameters("@ID").Value
  intStatus = .Parameters("@SPStatus").Value
  blnNewOrder = .Parameters("@NewOrder").Value

End With

cmdReturn.Dispose()
cnnConn.Close()
cnnConn.Dispose()

{% endhighlight %}

The obvious thing to do might be to use an ORM but in here I don't want to introduce more assemblies than I already have or add another layer of abstraction.

So I want to bring some basic DRY principles to simple ADO.NET coding.

First, we'll create a generic Db class where all instances of the connection string are called from.

{% highlight vbnet linenos %}

Public Class Db

  Public Shared Function GetConnection() As SqlConnection
    Return New SqlConnection(ConfigurationManager.ConnectionStrings("main").ConnectionString)
  End Function

End Class

{% endhighlight %}

Next we'll add a method for creating a DataSet. Nine times out of ten that's what we're doing here so it makes sense to have a generic method to handle this. Here is where the connection string is created (and ultimately destroyed). 

{% highlight vbnet linenos %}

Public Shared Function GetDataSet(sql As String) As DataSet

  Using conn = Db.GetConnection()
  
    Using cmd As New SqlCommand()
    
      Using adapter As New SqlDataAdapter(cmd)
      
        Dim data As New DataSet
        
        conn.Open()
        
        adapter.Fill(data)
        
        Return data
        
      End Using
      
    End Using
    
  End Using
  
End Function

{% endhighlight %}

To make the method more flexible there is an optional boolean value to indicate the sql string argument is the name of a stored procedure.

{% highlight vbnet linenos %}

Public Shared Function GetDataSet(sql As String, Optional isStoredProcedure As Boolean = False) As DataSet

...

If isStoredProcedure Then
  cmd.CommandType = CommandType.StoredProcedure
End If

...

{% endhighlight %}

Great now we have a generic method but it only handles a SQL string and we need to be able to append paramaters to our command object. To do this I created a method which dynamically creates paramaters by matching the names of the paramaters in the SQL source with the field names of a POCO (plain old CLR object) object using Reflection. This was a bit tricky as I had to parse the SQL for carriage returns and other problematic whitespace.

{% highlight vbnet linenos %}

Public Shared Sub AddParams(ByRef cmd As SqlCommand, source As Object)

  Dim sql = cmd.CommandText.ToLower()
  
  For Each p In source.GetType().GetProperties
  
    Dim has As Func(Of Integer, Boolean) = _
      Function(val) sql.Contains(String.Format("@{0}{1}", p.Name.ToLower(), Char.ConvertFromUtf32(val)))
    
    If has(10) Or has(32) Or has(41) Or has(44) Then
    
      Dim value = p.GetValue(source)
      
      cmd.Parameters.AddWithValue(String.Format("@{0}", p.Name), If(value Is Nothing, DBNull.Value, value))
      
    End If
    
  Next
  
End Sub
	
{% endhighlight %}

We then update our `GetDataSet` method so it uses the method added above.

{% highlight vbnet linenos %}

Public Shared Function GetDataSet(sql As String, source As Object, _
  Optional isStoredProcedure As Boolean = False) As DataSet
      
  ...
  
  If source IsNot Nothing Then
    Db.AddParams(cmd, source)
  End If

{% endhighlight %}

Most of the time I work with DataTables so we'll add a wrapper function so we don't have to extract the DataTable from the function every time.

{% highlight vbnet linenos %}

Public Shared Function GetDataTable(sql As String, source As Object, _
  Optional isStoredProcedure As Boolean = False) As DataTable
  
  Return Db.GetDataSet(sql, source, isStoredProcedure).Tables(0)
  
End Function

{% endhighlight %}

We're almost there. Let's create a POCO class to test our new data access methods.

{% highlight vbnet linenos %}

Public Class User
  Public Property Id As Integer
  Public Property Name As String
  Public Property Password As String
End Class

{% endhighlight %}

Next we'll add a method to our class that creates our SQL string and executes GetDataTable. Normally I would create a service layer but this is for demonstration purposes only.

{% highlight vbnet linenos %}

Public Sub [Get]()
  Db.GetDataTable(<sql>select Id, Name, Password from Users where Id = @Id </sql>.Value, New With {.Id = Me.Id})
End Sub

{% endhighlight %}

That's great but we need to bind the return values with our POCO fields. We'll create a method for doing this, again using Reflection but this time we'll match the POCO class fields with a DataRow (you'll notice the function checks for Enum fields and null values).

{% highlight vbnet linenos %}

Public Shared Sub BindDataRow(row As DataRow, source As Object)
  
  Dim info = source.GetType().GetProperties()
  
  For Each p In info
  
    For Each c In row.Table.Columns
    
      If p.Name.ToLower() = c.Caption.ToLower() Then
      
        Dim value = row(c.Caption)
        
        If p.PropertyType = GetType(Boolean) Then
          value = (value.ToString() = 1.ToString() OrElse value.ToString() = True.ToString())
        End If
        
        If Object.ReferenceEquals(p.PropertyType.BaseType, GetType([Enum])) Then
          value = Convert.ToInt32(value)
        End If
        
        If Not DBNull.Value.Equals(value) Then
          p.SetValue(source, value)
        End If
        
      End If
      
    Next
    
  Next
  
End Sub

{% endhighlight %}

Finally we amend our POCO Get function and we're all set to go.

{% highlight vbnet linenos %}

...

For Each row In Db.GetDataTable("select Id, Name, Password from Users where Id = @Id ", _
  New With {.Id = Me.Id}).Rows
  
  Db.BindDataRow(row, Me)
  
Next

...

{% endhighlight %}

That's it. If you execute the code below the Name field's value will be written to the console.

{% highlight vbnet linenos %}

Dim user As New User With {.Id = 1}

user.Get()

Console.WriteLine(user.Name)
		
{% endhighlight %}

There are a few things missing from this project but I've actually got a lot further with this than what is disclosed here. Certain helper methods and SQL generation for CRUD operations have been added. I will add this code to Github and the rest later. Please feel free to comment :-)