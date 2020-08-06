ps -eo pcpu | egrep [0-9] | (sum=0.0; while read line; do sum=$(echo "$sum+$line" | bc); done; echo $sum;)
