###take your users to a tour in your app. 
# how to use

```
import { guide } from 'user-guider';
...
guide(config)
```
config is of type IGuiderConfig
##### you nedd to include `styles/ug.css` to your global style.

##IGuiderConfig
```typescript
{
	elements: Array<IElementConfig>
}
```

##IElementConfig
```typescript
{
    name: string; //the element selector name
    text: string; // the description of the element
}
```
