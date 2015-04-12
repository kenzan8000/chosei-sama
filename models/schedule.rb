class Schedule < ActiveRecord::Base
  has_many :schedule_dates, :dependent => :destroy
  has_many :schedule_users, :dependent => :destroy
  has_many :schedule_attendances, :dependent => :destroy

  validates_presence_of :schedule_id
  validates_uniqueness_of :schedule_id
  validates_length_of :schedule_id, :minimum => 1, :maximum => 255

  validates_presence_of :name
  validates_length_of :name, :minimum => 1, :maximum => 255

  validates_length_of :description, :minimum => 0, :maximum => 255
end
