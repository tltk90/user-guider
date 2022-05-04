# how to use

```
import { guide } from 'user-guider';
...
guide(config)
```

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
