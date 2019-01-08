/etc/init.d/metasong stop
git fetch origin master
git reset --hard origin/master
chmod +x tools/update.sh
/etc/init.d/metasong start