# **_User Guider_**
# Take your users to a tour in your app. 
## Install 
`npm install user-guider`

## Usage
```
import { guide } from 'user-guider';
// rest of your code
const config = {
    elements: [{
            title: 'user-guider'
            text: 'This is my guide'
        },
        {
            name: '#my-awesome-div',
            text: 'This is my awesome div'
        }
    ],
    options: {
        animation: 'slide',
        colors: {
            background: '#43ff3d',
            text: '#00ef22'
        }
    }
}
guide(config)
```
**you nedd to include `styles/ug.css` to your global style.**

# Config
The config is an object, with the following properties
## elements
* require: true

elements is an array of objects with the following properties:

| property | require |  type  | description                                                                                                                     |
|:--------:|:-------:|:------:|---------------------------------------------------------------------------------------------------------------------------------|
|   name   |  false  | string | a css selector of the dom we want the guide window will be near to.<br> if not provide the guide window will place in the center. |
|   title  |  false  | string | the title for this step                                                                                                         |
|   text   |   true  | string | the description on this element                                                                                                 |                                                                                                                               |

## options
* require: false

options is an object with the following properties:

|   property   	|   type  	| description                                                                                                                                                       	|
|:------------:	|:-------:	|-------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
|      rtl     	| boolean 	| render this guide as rtl.<br>default false.                                                                                                                       	|
| buttonsTitle 	|  object 	| define the navigation button text:<br>{<br>next: string, default 'Next'<br>back: string, default 'Back'<br>done: string, default 'Done'<br>skip: string, default 'Skip'<br>} 	|
|    colors    	| object  	| change the color of the container:<br>{<br>background: css-color, default 'white'<br>text: css-color, default 'black'<br>}                                                   	|
|  animation  	| object  	| define the animation on step navigation, <br>{<br>type: possible values 'fade', 'slide', 'none';<br>duration: number, default 500<br>}<br>if type is 'none' duration is 0                                                   	|
| font | string | define the font family for the guider |
