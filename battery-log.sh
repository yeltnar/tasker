dir="/sdcard"

device_name=$(getprop ro.hardware)

to_write=$(node -e "const bat_obj=$(termux-battery-status);bat_obj.date=new Date().toString();console.log(JSON.stringify(bat_obj))")
printf "$to_write\n" >> $dir/battery-$device_name.log
printf "$to_write\n" > $dir/last-battery-$device_name.log

cat $dir/last-battery-$device_name.log

