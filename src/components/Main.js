require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
//must have this, or ReactDOM will be undefined
import ReactDOM from 'react-dom';

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


// get a random number within range
var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);




class ImgFigure extends React.Component {
	render (){

		let styleObj = {};
//如果props属性中指定了这张图片的位置,则使用
        if (this.props.arrange.pos) {
          styleObj = this.props.arrange.pos;
        } 
		return(
			<figure className ="img-figure" style = {styleObj}> 
			  <img src= {this.props.data.imageURL} alt={this.props.data.title}/>
			  <figcaption> 
			    <h2 className = "img-title">{this.props.data.title}</h2>
			  </figcaption>
			</figure> 
			)
	}
}

  
class GalleryByReactApp extends React.Component {
	constructor(){
		super();
// need to verify if this is right this.Constant other than this.state
		this.Constant = {

			// center position
			centerPos: {left:0,right:0},

			// horizontal range
			hPosRange: {
				leftSecX: [0,0],
				rightSecX: [0,0],
				y:[0,0]
			},

			// vertical range 
			vPosRange: {
				x:[0,0],
				topY:[0,0]
			}
		}
// constant is not the inital state 

		this.state = {
            imgsArrangeArr: [
                /*{
                    pos:{
                        left: 0,
                        top: 0
                    },
                    rotate: 0,//旋转角度
                    isInverse: false//图片正反面
                    isCenter:false 图片是否居中
                }*/
            ]
        }
	}


// rearrange image positions, params: centerIndex : select which 
// image to put in the center 

	rearrange(centerIndex){
		 let imgsArrangeArr = this.state.imgsArrangeArr,
                Constant = this.Constant,
                centerPos = Constant.centerPos,
                hPosRange = Constant.hPosRange,
                vPosRange = Constant.vPosRange,
                hPosRangeLeftSecX = hPosRange.leftSecX,
                hPosRangeRightSecX = hPosRange.rightSecX,
                hPosRangeY = hPosRange.y,
                vPosRangeTopY = vPosRange.topY,
                vPosRangeX = vPosRange.x,

                topImgNum = Math.floor(Math.random() * 2),//select one or none on top
                topImgSpiceIndex = 0,
                imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
                //center centerIndex image , image in the center do not need any angel
                // only one item in this array
                imgsArrangeCenterArr[0] = {
                    pos: centerPos
	             }

	    //取出要布局上测的图片的状态信息(先随意选一张图片作为顶部图片，然后取出来)
        topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        let imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);


	    // 取出布局top的图片信息状态

        imgsArrangTopArr.forEach((value, index) => {
          imgsArrangTopArr[index] = {
            pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            // rotate: get30DegRandom(),
            // isCenter: false

          };
        });

        //布局左两侧的图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
          let hPosRangeLORX = null;

          //前半部分布局左边,右边部分布局右边
          if (i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
          } else {
            hPosRangeLORX = hPosRangeRightSecX
          }
          imgsArrangeArr[i] = {
            pos: {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            },
            // rotate: get30DegRandom(),
            // isCenter: false
          };
        }
        if (imgsArrangTopArr && imgsArrangTopArr[0]) {
          imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });

     }

// after components mounted, calculate position range for each image
	componentDidMount(){

		// get stage DOM range
		

		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),

		    stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,

            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);


        //get image range
        let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigures1),
          imgW = imgFigureDOM.scrollWidth,
          imgH = imgFigureDOM.scrollHeight,
          halfImgW = Math.ceil(imgW / 2),
          halfImgH = Math.ceil(imgH / 2);

        // calculate center position 

        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }

         //calculate left/right area position range 
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW- halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW+halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        // randomly calculate an image number to put in center 

        let num = Math.floor(Math.random() * 10);
        this.rearrange(num);
        
	}

	

// if no initial state, set it to 0,0

	render() {
        let imgFigures = [];
        let controllerUnits = []
        imageData.forEach((value, index) =>{
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    }
                    
                }
            }
            imgFigures.push(
                <ImgFigure 
                    data = {value} 
                    key={index} 
                    ref={'imgFigures'+index} 
                    arrange = {this.state.imgsArrangeArr[index]} 
                     />
                );
        });



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
