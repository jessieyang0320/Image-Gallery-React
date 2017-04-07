# Image-Gallery-React
image gallery app developed with webpack + React + ES6 + SASS

 
 Yeoman: generic scaffolding system allowing for rapidly getting started on new projects and stream
 lines the maintenance of existing projects.  
 http://yeoman.io/
 
 generator-react- webpack 
 webpack takes modules with dependencies and generates static assets representing those modules.
 module bundler 
 (grunt not needed, webpack can do its part)
 
problem: version difference 

when use generator to generate react-webpack, there is no sass-loader in the package.json, follow install instructions on official github, always error: peerDependences, tried different ways to install, NOT WORKING, same error
This is what I did, I write sass-loader with the version it required in package.jason, then run npm install, done!

prefixer-loader , use postcss 

grunt is not included in webpack2 
start server: node server 
npm run dist 

write comments for instructions -- good habit, I wrote comments even in CSS file, just to tell which part is which

