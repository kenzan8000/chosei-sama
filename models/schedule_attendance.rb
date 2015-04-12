class ScheduleAttendance < ActiveRecord::Base
  belongs_to :schedule
  belongs_to :schedule_date
  belongs_to :schedule_user

  validates_presence_of :attendance
  validates_numericality_of :attendance
end
