require 'fileutils'
require 'mini_magick'

path = "#{ENV['HOME']}/Pictures/Screenshots/*.jpg"

file = Dir.glob(path).max_by { |f| File.mtime(f) }

name = File.basename file
name = name.sub 's ', ''
name = name.sub ' at ', '@'

name = name.sub '.jpg', ''

# name = name.sub '.', ''
# name = name[0, name.length - 7]

newfile = "#{File.dirname(File.expand_path __FILE__)}/images/#{name}.jpg"

FileUtils.cp file, newfile

sizes = {:xs => 400, :sm => 800, :md => 1200, :lg => 1600}

puts newfile

sizes.each do | size, value |
  image = MiniMagick::Image.open(file)
  image.resize "#{value}x#{value}"
  filename = "#{File.dirname(File.expand_path __FILE__)}/images/#{name}-#{size}.jpg"
  image.write filename

  puts filename

end

FileUtils.rm file
