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


class ImgFigure extends React.Component {
	render (){
		return(
			<figure> 
			  <img src= {this.props.data.imageURL} alt={this.props.data.title}/>
			  <figcaption> 
			    <h2>{this.props.data.title}</h2>
			  </figcaption>
			</figure> 
			)
	}
}

  
class GalleryByReactApp extends React.Component {
	render(){ 

		var controllerUnits = []
		var imgFigures = []

		imageData.forEach(function(value){
			imgFigures.push(<ImgFigure data = {value}/>);

		})



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

export default GalleryByReactApp;
