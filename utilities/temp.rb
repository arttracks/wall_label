
current_line = nil
extra_data = {}
File.foreach("csvs/extra_data.txt") do |line| 
  
  # Detect new lines
  if line.include? ":"
    current_line = line.split(":").first 
    extra_data[current_line] = []
    next
  end

  # Handle blank leading lines
  next unless current_line

  date, place = line.split(" - ")
  next unless place
  place.strip!
  date = date.split("-").first
  extra_data[current_line] << {year: date, place: place}
end
puts extra_data