import {useRef } from "react";

type Input={
    value:string
    changeText:(newtext:string)=>void

}

function AutoSizeTextInput({value,changeText}:Input) {
  //const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null); //useRef is used whenever you need to reference a value not needed for rendering. Its like state for a value thats not needed for rendering.
  //Ref does not cause a rerender. 
  //So in this case we are creating a reference to an actual  HTML Text Area dom node. We need to use this because to create a dyanmically sized text box we need to access actual values from the dom like 
  //height of the content so we can resize the text box - react does not have access to these measurements- only the actual dom element does.

  const handleChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    //setText(e.target.value); //updates react state - triggers rerender
    changeText(e.target.value)

    if (!textareaRef.current) return;
    // Reset height so it can shrink if needed
    textareaRef.current.style.height = "auto";

    // Set height to match content
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  };

  return (
    <textarea
      ref={textareaRef} //when the textarea renders this creates the reference to the textareaRef. Now textareaRef.current points to the live text area which allows us to access things like height etc.
      value={value}
      onChange={handleChange}
      style={{
        overflow: "hidden",
        resize: "none",
      }}
    />
  );
}

export default AutoSizeTextInput;
//The way this component works. It uses useRef which allows us to reference values not needed for rendering - in this case the actual DOM element. So when the text area is rendered it creates a pointer
//to textareaRef so now you textareRef.current points to the actual DOM element for the text area. THis allows us to access values like the actuall height of the DOM element etc. When a user types in 
//the text box the actual DOM updates and it triggers onChange to run handleChange - handleChange then runs setText which starts a React rerender. Then textareaRef.current.style.height etc can immediatly
//update the DOM regardless of React re-render timeline because of useRef - here we use it to match the height of the text area to the height of the content that has been typed -> we have access to the new height
//because the DOM already updated when we typed. Then outside of this sometime the React re-render finishes and the internal react state now reflects the change in the text -> however in our case we are only
//changing the text when a user types which has already been updated so nothingn visually happens once the React re-render finishes. 
