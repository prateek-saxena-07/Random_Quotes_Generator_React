import { useEffect, useState } from 'react';

export const App = () => {
  const [quote, setQuote] = useState('');
  const [all, setAll] = useState([]);
  const [init, setInit] = useState(false);
  const [hex, setHex] = useState('');
  const [opacity, setOpacity] = useState(1);  // To control text fade-in/out

  // Function to generate a random color and new quote
  const newQuote = () => {
    // Fade out the text by setting opacity to 0
    setOpacity(0);

    setTimeout(() => {
      const random = Math.floor(Math.random() * 1453);
      setQuote(all[random]);

      let str = '#';
      const arr = '0123456789ABCDEF';
      for (let i = 0; i < 6; i++) {
        let index = Math.floor(Math.random() * 16);  // Change to 16 for correct index range
        str = str + arr[index];
      }
      setHex(str);

      // After changing the color and quote, fade back in
      setOpacity(1);
    }, 500);  // Delay to synchronize the fade out and color change
  }

  // Fetching quotes from the API
  async function random() {
    const response = await fetch('https://dummyjson.com/quotes?limit=0');
    const data = await response.json();
    setAll(data.quotes);
  }

  // Load quotes on component mount
  useEffect(() => { random() }, []);

  // Initialize the first quote after quotes are fetched
  useEffect(() => {
    if (all.length > 0 && !init) {
      newQuote();
      setInit(true);
    }
  }, [all]);

   useEffect(() => {
    const interval = setInterval(newQuote, 4000); // Change every 5 seconds

    return () => clearInterval(interval);  // Clean up interval on unmount
  }, [all]);

  return (
    <>
      <div className="flex justify-center items-center h-screen"
        style={{
          backgroundColor: hex,
          transition: 'background-color 1s ease-in-out'  // Smooth background transition
        }}>
        <div id='quote-box' className=''
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
          }}>
          {quote ? (
            <>
              <div id='text' style={{
                color: hex,
                opacity: opacity,   // Control text visibility with opacity
                transition: 'opacity 0.5s ease-in-out'  // Smooth opacity transition
              }}>
                {quote.quote}
              </div>
              <div id="author" style={{
                opacity: opacity,   // Fade author text as well
                transition: 'opacity 0.5s ease-in-out'  // Smooth opacity transition
              }}>
                - {quote.author}
              </div>
            </>
          ) : 'Loading....'}
          <div>
            <a href="https://twitter.com/intent/tweet" id="tweet-quote" target='_blank'>
              <i className="fa-brands fa-square-twitter"></i>
            </a>
            <button onClick={newQuote} id='new-quote'>
              New Quote
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
