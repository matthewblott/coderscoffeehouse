require 'fileutils'
require 'mini_magick'

PROJECT_NAME = 'coders-coffeehouse'

path = "#{ENV['HOME']}/Pictures/Screenshots/*.jpg"

file = Dir.glob(path).max_by { |f| File.mtime(f) }

basename = File.basename file

# copy the file to an images folder for archiving, this is because it's highly unlikely to be required again
# and keeping it in the project will lead to unnecessary bloat
FileUtils.cp file, "#{ENV['HOME']}/Pictures/#{PROJECT_NAME}/#{basename[2, 10]}@#{basename[16, 8]}.jpg"

# create the directory if it does not exist
dirname = "#{File.dirname(File.expand_path __FILE__)}/_assets/images/posts/#{basename[2, 10].gsub('-', '')}"

puts dirname

unless File.directory?(dirname)
  FileUtils.mkdir_p(dirname)
end

sizes = {:xs => 400, :sm => 800} # :md => 1200, :lg => 1600

sizes.each do | size, value |
  image = MiniMagick::Image.open(file)
  image.resize "#{value}x#{value}"
  filename = "#{dirname}/#{basename[16, 8].gsub('.', '')}-#{size}.jpg"
  image.write filename

  puts filename

end

FileUtils.rm file