require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
// get the image files 
let imageData = require('json!../data/imageData.json');

// generate change image data to image url:

function genImageURL(imageDataArr) {
	for(var i=0;i< imageDataArr.length; i++) {
		var singleImageData = imageDataArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
	    
	    imageDataArr[i] = singleImageData;
	}

	return imageDataArr;
}

 imageData = genImageURL(imageData);

  
class GalleryByReactApp extends React.Component {
	render(){
		return(
           <section className="stage" ref="stage">
               <section className="img-sec">
                     {imgFigures}
               </section>
               
               <nav className="controller-nav">
                     {controllerUnits}
               </nav>
           </section>


			);
	}
}


GalleryByReactApp.defaultProps = {
};

export default AppComponent;
