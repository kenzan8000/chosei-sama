class ScheduleDate < ActiveRecord::Base
  belongs_to :schedule
  has_many :schedule_attendances, :dependent => :destroy

  validates_uniqueness_of :date
  validates_presence_of :date
end
