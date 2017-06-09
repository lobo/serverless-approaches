path=../sample-pictures/*
aws_path=/
resolution=150x150

for file in $path
do
  filename=$(basename $file)
  curl -L "http://tpredes.s3-website-us-east-1.amazonaws.com$aws_path$resolution/$filename" > /dev/null &
done
