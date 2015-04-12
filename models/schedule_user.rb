class ScheduleUser < ActiveRecord::Base
  belongs_to :schedule
  has_many :schedule_attendances, :dependent => :destroy

  validates_presence_of :name
  validates_length_of :name, :minimum => 1, :maximum => 255
end
