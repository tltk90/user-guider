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

***If you want to disable the user's clicks in the app during the tour.<br>you can use the `lockApp` & `unlockApp` functions***
# Config
The config is an object, with the following properties
## elements
* require: true

elements is an `array` of `objects` with the following properties:

| property | require |  type  | description                                                                                                                     |
|:--------:|:-------:|:------:|---------------------------------------------------------------------------------------------------------------------------------|
|   text   |   true  | string | the description on this element                                                                                                 |                                                                                                                               |
|   element   |  false  | string &#124;Array&lt;string&gt; | a css selector of the dom we want the guide window will be near to.<br> if not provide the guide window will place in the center. |
|   title  |  false  | string | the title for this step                                                                                                         |
| position | false | 'center' &verbar; 'element' | the position of the guider, default to element. |
| beforeGuide| false| function| a function that be called before this step will be run.|
| afterGuide| false | function | a function that be called after this step in done, called with the current dom element if exist |
 
## options
* require: false

options is an `object` with the following properties:

|   property   	|   type  	| description                                                                                                                                                       	|
|:------------:	|:-------:	|-------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
|      rtl     	| boolean 	| render this guide as rtl.<br>default false.                                                                                                                       	|
| buttonsTitle 	|  object 	| define the navigation button text:<br>{<br>next: string, default 'Next'<br>back: string, default 'Back'<br>done: string, default 'Done'<br>skip: string, default 'Skip'<br>} 	|
| buttonsTheme  | string    | define the style of the navigation buttons <br> possible values: 'round', 'solid' <br> default 'round'.                                                                       |
|    colors    	| object  	| change the color of the container:<br>{<br>background: css-color, default '#000000aa'<br>text: css-color, default '#f9f9f9'<br>elementBorder: css-color, default 'transparent'}                                                   	|
|  animation  	| object  	| define the animation on step navigation, <br>{<br>type: possible values 'fade', 'slide', 'none';<br>duration: number, default 500<br>}<br>if type is 'none' duration is 0                                                   	|
| font | string | define the font family for the guider |

## onUserGuiderEnd
* require: false

a `function` that will be called when the guider is hide from the screen.
the function will be called with an `event` argument according to why the guider is hide.
* 'close' - if the user click the close button
* 'skip' - if the user click the skip button
* 'done' - if the use click the done button
