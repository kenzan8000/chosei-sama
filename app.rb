require 'bundler/setup'
require 'date'
Bundler.require
# activerecord
require './models/schedule.rb'
require './models/schedule_date.rb'
require './models/schedule_user.rb'
require './models/schedule_attendance.rb'


# active record
use ActiveRecord::ConnectionAdapters::ConnectionManagement

configure :development do
  db_config = YAML.load_file('config/database.yml')
  ActiveRecord::Base.establish_connection(db_config['development'])
end
configure :production do
  ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])
end


# error
error 400 do
  slim :error_400
end

not_found do
  slim :error_404
end

error 500 do
  slim :error_500
end

get '/400' do
  slim :error_400
end

get '/404' do
  slim :error_404
end

get '/500' do
  slim :error_500
end


# get
get '/' do
  slim :index
end

get '/schedule/:id' do
  @schedule_id = params[:id]
  @schedule = Schedule.find_by(schedule_id:@schedule_id)
  redirect '/404' if @schedule.nil?
  @schedule_dates = @schedule.schedule_dates.nil? ? Array.new : @schedule.schedule_dates
  @schedule_users = @schedule.schedule_users.nil? ? Array.new : @schedule.schedule_users

  @schedule_attendances = Array.new
  for i in 0..@schedule_dates.length-1
    @schedule_attendances[i] = Array.new
    for j in 0..@schedule_users.length-1
      for k in 0..@schedule_dates[i].schedule_attendances.length-1
        for l in 0..@schedule_users[j].schedule_attendances.length-1
          if @schedule_dates[i].schedule_attendances[k].id == @schedule_users[j].schedule_attendances[l].id
            @schedule_attendances[i][j] = @schedule_users[j].schedule_attendances[l].attendance
          end
        end
      end
    end
  end

  slim :schedule
end


# post
post '/schedule', provides: :json do
  # example json
  # {
  #   'name':'hoge',
  #   'description':'fuga',
  #   'dates':[
  #     'Wed, 23 Sep 2009 22:15:29 GMT',
  #     'Thu, 24 Sep 2009 22:15:29 GMT',
  #     'Fri, 25 Sep 2009 22:15:29 GMT'
  #   ]
  # }
  response = {}
  response['application_code'] = '400'
  response['redirect_url'] = '/400'

  begin
    params = JSON.parse(request.body.read)
  rescue
    return response.to_json
  end

  dates = params['dates']
  return response.to_json if !dates.kind_of?(Array)

  schedule_id = SecureRandom.uuid.to_str.delete('-')

  # create schedule
  schedule = Schedule.new
  schedule.schedule_id = schedule_id
  schedule.name = params['name']
  schedule.description = params['description']
  return response.to_json if !schedule.valid?
  # create schedule_date
  date_count = 0
  schedule_dates = Array.new
  dates.each do |date_string|
    schedule_date = ScheduleDate.new
    date = DateTime.httpdate(date_string)
    schedule_date.date = date
    if schedule_date.valid?
      date_count = date_count + 1
    end
    schedule_dates.push(schedule_date)
  end
  return response.to_json if date_count < 2
  # save
  schedule.save
  schedule_dates.each do |schedule_date|
    if schedule_date.valid?
      schedule_date.save
      schedule.schedule_dates << schedule_date
    end
  end

  response['application_code'] = '200'
  response['redirect_url'] = '/schedule/'+schedule_id
  response.to_json
end

post '/schedule_attendance', provides: :json do
  # example json
  # {
  #   'schedule_id':'1',
  #   'user_name':'hoge',
  #   'attendances':{
  #     '21':'0', -> schedule_date_id:schedule_attendance.attendance
  #     '22':'1',
  #     '23':'0'
  #   }
  # }
  response = {}
  response['application_code'] = '400'
  response['redirect_url'] = '/400'

  begin
    params = JSON.parse(request.body.read)
  rescue
    return response.to_json
  end

  attendances = params['attendances']
  return response.to_json if !attendances.kind_of?(Hash)

  #find schedule
  schedule_id = params['schedule_id']
  schedule = Schedule.find_by(schedule_id:schedule_id)
  return response.to_json if schedule.nil?
  #create schedule_user
  schedule_user = ScheduleUser.find_by(schedule_id:schedule.id, name:params['user_name'])
  schedule_user.destroy if !schedule_user.nil?
  schedule_user = ScheduleUser.new
  schedule_user.name = params['user_name']
  return response.to_json if !schedule_user.valid?
  #find schedule_dates and create schedule_attendance
  schedule_dates = Array.new
  schedule_attendances = Array.new
  attendances.each{|schedule_date_id, attendance|
    #schedule_date
    schedule_date = ScheduleDate.find_by(id:schedule_date_id)
    return response.to_json if schedule_date.nil?
    schedule_dates.push(schedule_date)
    #schedule_attendance
    schedule_attendance = ScheduleAttendance.new
    schedule_attendance.schedule_date_id = schedule_date.id
    schedule_attendance.attendance = attendance
    return response.to_json if !schedule_attendance.valid?
    schedule_attendances.push(schedule_attendance)
  }
  #save
  schedule_user.save
  schedule.schedule_users << schedule_user
  schedule_attendances.each do |schedule_attendance|
    schedule_attendance.save
    schedule.schedule_attendances << schedule_attendance
    schedule_user.schedule_attendances << schedule_attendance
    schedule_dates.each do |schedule_date|
      if schedule_attendance.schedule_date_id == schedule_date.id
        schedule_date.schedule_attendances << schedule_attendance
      end
    end
  end

  response['application_code'] = '200'
  response['redirect_url'] = '/schedule/'+schedule_id
  response.to_json
end

post '/delete_schedule/:id' do
  response = {}
  response['application_code'] = '400'
  response['redirect_url'] = '/400'

  schedule = Schedule.find_by(id:params[:id])
  return response.to_json if schedule.nil?

  response['application_code'] = '200'
  response['redirect_url'] = '/'
  schedule.destroy

  response.to_json
end

post '/delete_schedule_user/:id' do
  response = {}
  response['application_code'] = '400'
  response['redirect_url'] = '/400'

  schedule_user = ScheduleUser.find_by(id:params[:id])
  return response.to_json if schedule_user.nil?
  schedule = Schedule.find_by(id:schedule_user.schedule_id)
  return response.to_json if schedule.nil?

  response['application_code'] = '200'
  response['redirect_url'] = '/schedule/'+schedule.schedule_id
  schedule_user.destroy

  response.to_json
end
