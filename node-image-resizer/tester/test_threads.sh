path=../images/originals/*
resolution=500x500

for file in $path
do
  filename=$(basename $file)
  curl -L "http://localhost:8080/images/$resolution/$filename" > /dev/null &
done
