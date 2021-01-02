$version=$args[0]
$appName="dd5App"
$releaseName=$appName+"_"+$version

.\buildBackend.ps1
.\buildFrontend.ps1
mkdir $releaseName
mkdir $releaseName\front
cp -r front\build $releaseName\front
cp -r templates $releaseName
cp -r bin $releaseName
zip -r $releaseName"."zip $releaseName/*
rm -r $releaseName