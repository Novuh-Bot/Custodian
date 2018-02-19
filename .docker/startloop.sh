
for waitstep in {5..1}
do
    echo "waiting to catch up ($waitstep seconds)..";
    sleep 1;
done

export firstNpmStartTime=$(date +%s);
while [ 1 ];
do
    export lastNpmStartTime=$(date +%s);
    npm start;
    export npmExitCode=$?;
    test $npmExitCode -eq 0 && break;
    test $(expr $(date +%s) - 20) -lt $firstNpmStartTime && echo "died unreasonably quickly, propagating." && exit $npmExitCode;
    test $(expr $(date +%s) - 90) -lt $lastNpmStartTime && echo "died too quickly, extending wait by 60 seconds.." && sleep 60;
    echo "died for unknown reason; waiting 10 seconds before restarting..";
    sleep 10;
done

echo "died by either interrupt or standard exit; not restarting";