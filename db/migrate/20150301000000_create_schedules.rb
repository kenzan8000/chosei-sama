class CreateSchedules < ActiveRecord::Migration
  def change
    create_table :schedules do |t|
      t.string :schedule_id
      t.string :name
      t.string :description
      t.timestamps
    end

    create_table :schedule_dates do |t|
      t.string :schedule_id
      t.datetime :date
      t.timestamps
    end

    create_table :schedule_users do |t|
      t.string :schedule_id
      t.string :name
      t.string :image_url
      t.timestamps
    end

    create_table :schedule_attendances do |t|
      t.string :schedule_id
      t.string :schedule_date_id
      t.string :schedule_user_id
      t.integer :attendance
      t.timestamps
    end
  end
end
