# Simple, No Dependencies  
# Take your users to a tour in your app. 
### How to use

```
import { guide } from 'user-guider';
...
guide(config)
```
config is of type IGuiderConfig
##### you nedd to include `styles/ug.css` to your global style.

## IGuiderConfig
```typescript
{
	elements: Array<IElementConfig>
}
```

## IElementConfig
```typescript
{
    name: string; //the element selector name if not specific the container will be placed in the center. 
    title: string; // title for the element
    text: string; //require, the description of the element
}
```
