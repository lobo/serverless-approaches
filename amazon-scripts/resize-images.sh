path=../sample-pictures/*
aws_path=/
resolution=500x500

for file in $path
do
  filename=$(basename $file)
  curl -s -L "http://tpredes.s3-website-us-east-1.amazonaws.com$aws_path$resolution/$filename" > /dev/null &
  echo $filename
done
