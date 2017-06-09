#S3 parameters

path=../sample-pictures/*

S3KEY=AKIAJEXQRFORR5UFB2QA
S3SECRET=TR/TmaDfCtRt47g8oTfOEZqJ8tVVno5H/H9K309r
S3BUCKET=tpredes
S3STORAGETYPE="STANDARD" #REDUCED_REDUNDANCY or STANDARD etc.
AWSREGION="s3"

aws_path=/img/
bucket="${S3BUCKET}"
date=$(date +"%a, %d %b %Y %T %z")
acl="x-amz-acl:private"
content_type="application/octet-stream"
storage_type="x-amz-storage-class:${S3STORAGETYPE}"
for file in $path
do
  filename=$(basename $file)
  echo $filename
  string="PUT\n\n$content_type\n$date\n$acl\n$storage_type\n/$bucket$aws_path$filename"
  signature=$(echo -en "${string}" | openssl sha1 -hmac "${S3SECRET}" -binary | base64)
  curl -s -X PUT -T "$file" \
    -H "Host: $bucket.${AWSREGION}.amazonaws.com" \
    -H "Date: $date" \
    -H "Content-Type: $content_type" \
    -H "$storage_type" \
    -H "$acl" \
    -H "Authorization: AWS ${S3KEY}:$signature" \
    "https://$bucket.${AWSREGION}.amazonaws.com$aws_path$filename"
done
