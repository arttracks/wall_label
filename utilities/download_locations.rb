require "json"
require 'csv'
require "geo_deluge"

# Get the locations from the first spreadsheet, and put them into a cache
lookup = GeoDeluge::Lookup.new(cache_file: "./fast_cache.json")
locations = CSV.read("csvs/northbrook locations.csv")
locations.shift
name_lookup = {}
locations.each_with_index do |l,i| 
  lng, lat = lookup.get_lng_lat(l[1], verbose: true)
  data = {id:  l[1], lat: lat, lng: lng}
  name_lookup[l[0]] = data
end


missing_locations = []
paintings = []

row_counter = 0
CSV.foreach("csvs/Northbrook painting locations.csv", headers: true) do |row|
  events = []

  if row["creation place"]
    creation_place = name_lookup[row["creation place"].strip]
    if creation_place.nil?
      missing_locations << "could not find #{row["creation place"]}"
      next
    end
    events << {year: row["creation date"].to_i || 1500, lat: creation_place[:lat], lng: creation_place[:lng]}
  end

  # if row[6]
    entry_place = name_lookup[row[6].strip]
    if entry_place.nil?
      puts row[6]
      missing_locations << "could not find #{row[6]}"
      next
    end
    events << {year: row["NB entry date"].split("-").first.to_i, lat: entry_place[:lat], lng: entry_place[:lng]}
  # end

  if row[8]
    entry_place = name_lookup[row[8].strip]
    if entry_place.nil?
      puts row[8]
      missing_locations << "could not find #{row[8]}"
      next
    end
    events << {year: row[7].split("-").first.to_i, lat: entry_place[:lat], lng: entry_place[:lng]}
  end

    if row[10]
    entry_place = name_lookup[row[10].strip]
    if entry_place.nil?
      puts row[10]
      missing_locations << "could not find #{row[10]}"
      next
    end
    events << {year: row[9].split("-").first.to_i, lat: entry_place[:lat], lng: entry_place[:lng]}
  end

  paintings << {id: row_counter+=1, events: events}
end

File.open("../src/data/painting_events.json","w") {|f| f.puts JSON.pretty_generate paintings}

puts missing_locations.uniq
