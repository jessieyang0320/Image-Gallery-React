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

 // es 6

//  imageDatas = (function getImageURL(imageDatasArr){
//   for(var i = 0,len = imageDatasArr.length; i < len; i++){
//     var singleImageData = imageDatasArr[i];

//     singleImageData.imageURL = require('../images/' + singleImageData.fileName);

//     imageDatasArr[i] = singleImageData;
//   }

//   return imageDatasArr;
// })(imageDatas);


// get a random number within range
var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

//获取0-30°之间一个任意正负值
var get30DegRandom = () => {
  let deg = '';
  deg = (Math.random() > 0.5) ? '+' : '-';
  return deg + Math.ceil(Math.random() * 30);
};

// image component
class ImgFigure extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
    }

    //when click, image flips to the other side
    handleClick(e){
        if (this.props.arrange.isCenter) {
          this.props.inverse()
        } else {
          this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }

	render (){
		let styleObj = {};
//如果props属性中指定了这张图片的位置,则使用
        if (this.props.arrange.pos) {
          styleObj = this.props.arrange.pos;
        }
//  if degree is less than 30, keep turning

        if(this.props.arrange.rotate) {
            let rotate = this.props.arrange.rotate;
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value) => {
              styleObj[value] = 'rotate(' + rotate + 'deg)';
            });
        }
        //set up z index of the centered image, so that it won`t be covered by others
        if(this.props.arrange.isCenter) {
            styleObj.zIndex = 11;
        }
        let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';

		return(
			<figure className ={imgFigureClassName} style = {styleObj} onClick={this.handleClick}>
			  <img src= {this.props.data.imageURL} alt={this.props.data.title}/>
			  <figcaption>
			    <h2 className = "img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
              <p>
                {this.props.data.desc}
              </p>
          </div>
			  </figcaption>
			</figure>
			)
	}
}
// controller unit component
class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  /*
   *imgsFigue click function
   */
  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse()
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render() {
    let controllerUnitClassName = 'controller-unit';
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center ';
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += 'is-inverse'
      }
    }
    return (
      <span className={ controllerUnitClassName } onClick={this.handleClick}></span>
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
                    rotate: 0,//rotate degree
                    isInverse: false//back of image
                    isCenter:false //if img centered
                }*/
            ]
        }
	}

// flip image, index is the index of which is flipped
inverse(index) {
    return () => {
      let imgsArrangArr = this.state.imgsArrangeArr;
      imgsArrangArr[index].isInverse = !imgsArrangArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangArr
      })
    }
  }

/* use arrange function
  *center chosed image
   */
  center(index) {
    return () => {
      this.rearrange(index);
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
                    pos: centerPos,
                    rotate: 0,
                    isCenter: true
	             }

			// randomly choose an image and put it on top
        topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        let imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);


	    // get info of the image on top
        imgsArrangTopArr.forEach((value, index) => {
          imgsArrangTopArr[index] = {
            pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate: get30DegRandom(),
            isCenter: false

          };
        });

        //right and left side images
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
          let hPosRangeLORX = null;


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
            rotate: get30DegRandom(),
            isCenter: false
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
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter: false
                }
            }
            imgFigures.push(
                <ImgFigure
                    data = {value}
                    key={index}
                    ref={'imgFigures'+index}
                    arrange = {this.state.imgsArrangeArr[index]}
                    inverse={this.inverse(index)}
                    center={this.center(index)}/>
                );
						controllerUnits.push(<ControllerUnit
										key={index}
										arrange={this.state.imgsArrangeArr[index]}
                    inverse={this.inverse(index)}
                    center={this.center(index)}/>);
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
