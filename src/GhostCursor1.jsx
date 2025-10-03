import React, { useState, useCallback } from "react";
import { Slider } from "radix-ui";
import { styled, css } from "styled-components";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["REACT_APP_OPENAI_API_KEY"],
  dangerouslyAllowBrowser: true,
});

const GhostCursor1 = () => {
  const [values, setValues] = useState(Array(10).fill(50));

  const [inputWord, setInputWord] = useState("");
  const [outputEssay, setOutputEssay] = useState("");

  const handleChange = (index, newValue) => {
    // create a new array so React sees the update
    const updated = [...values];
    updated[index] = newValue;
    setValues(updated);
  };

  const submit = useCallback(async () => {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
          Generate a 10-sentence essay on the topic ${inputWord}. 
          The following array contains 10 values ranging from 0-100 each. 
          Take each element in the array and use it as a guide for how funny the corresponding setence should be.
          For example, an array that goes [0,0,10,...] would mean that the sentence 1 and 2 should be very serious, but sentence 3 should be very funny and so on.
          Keep it snappy, short and simple. Nothing too winding.
          When in doubt, err on the side of dry humor. Go British in terms of humor. 
          A little bit of gallows humor is okay, but no explicit mention of violence or hate or gore. 
          Here's the array: ${JSON.stringify(values)}`,
        },
      ],
    });

    try {
      //   const result = await fetch("/.netlify/functions/coffeeLabel", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ name }),
      //   });
      //   const data = await result.json();

      const response = completion.choices[0].message.content;

      setOutputEssay(response);
      console.log(response);
    } catch (e) {
      console.error(e);
      //   setErrorLoadingCoffee(true);
      //   setIsLoadingCoffee(false);
      //   setTimeout(() => {
      //     setErrorLoadingCoffee(false);
      //   }, 2000);
    }
  }, [inputWord, values]);

  return (
    <Wrapper>
      <div style={{ height: 500, margin: "0 auto" }}>
        {/* YELO */}
        <input
          type="text"
          value={inputWord} // controlled value
          onChange={(e) => setInputWord(e.target.value)}
          placeholder={"Enter word here"}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
        {values.map((value, index) => (
          <>
            <CustomSlider
              key={index}
              onChange={(v) => handleChange(index, v)}
              defaultValue={50}
              value={value}
            />
            {value}
          </>
        ))}
        {/* <CustomSlider /> */}
        <button onClick={submit}>Generate</button>
      </div>
      <Essay>{outputEssay}</Essay>
    </Wrapper>
  );
};

export default GhostCursor1;

const Wrapper = styled.div`
  margin: 50px 10% 0 10%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
`;

const Essay = styled.div`
  max-width: 50%;
`;

const CustomSlider = ({ onChange, defaultValue }) => (
  <StyledSliderRoot
    className="SliderRoot"
    defaultValue={[defaultValue]}
    max={100}
    step={1}
    onValueChange={onChange}
  >
    <StyledSliderTrack className="SliderTrack">
      <StyledSliderRange className="SliderRange" />
    </StyledSliderTrack>
    <StyledSliderThumb className="SliderThumb" aria-label="Volume" />
  </StyledSliderRoot>
);

const StyledSliderRoot = styled(Slider.Root)`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 200px;
  height: 20px;
  margin: 8px;
`;

const StyledSliderTrack = styled(Slider.Track)`
  background-color: gray;
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  height: 3px;
`;

const StyledSliderRange = styled(Slider.Range)`
  position: absolute;
  background-color: green;
  border-radius: 9999px;
  height: 100%;
`;

const StyledSliderThumb = styled(Slider.Thumb)`
  display: block;
  width: 20px;
  height: 20px;
  background-color: white;
  box-shadow: 0 2px 10px gray;
  border-radius: 10px;

  &:hover {
    background-color: black;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 5px black;
  }
`;
