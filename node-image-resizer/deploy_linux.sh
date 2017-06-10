kill $(ps aux | grep 'node .' | awk '{print $2}')
nohup node . > foo.out 2> foo.err < /dev/null &
tail -f foo.out
