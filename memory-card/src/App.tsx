import { useEffect, useState } from 'react'
import '../src/styles/App.css'

function App() {
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [lastSelectedCardId, setLastSelectedCardId] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

 useEffect(() => {
    const fetchImages = async () => {
      const urls: string[] = [];

      for (let i = 0; i < 10; i++) {
        try {
          const response = await fetch("https://picsum.photos/200");
          if (!response.ok) throw new Error("Failed to fetch image");

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          urls.push(url);
        } catch (error) {
          console.error("Error fetching image", error);
        }
      }

      setImageUrls(urls);
    };

    fetchImages();

    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleClick = (cardId: string) => {
    if(cardId === lastSelectedCardId){
      if(currentScore > bestScore){
        setBestScore(currentScore);
      }
      setCurrentScore(0);
      setLastSelectedCardId('');
    } else {
      setCurrentScore(currentScore + 1);
      setLastSelectedCardId(cardId);
    }
    const newArray = imageUrls;
    let currentIndex = newArray.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
    }

    setImageUrls(newArray);
  }

  return (
    <>
      <div id='header'>
        <div id='title'>
          <h1>Memory Card Game</h1>
          <h2>Get points by clicking on an image but don't click on any more than once!</h2>
        </div>
        <div id="scoreBoard">
          <p>Score: {currentScore}</p>
          <p>Best Score: {bestScore}</p>
        </div>
      </div>
      <div id="card-container">
        {imageUrls.map(url => <Card key = {url} imageUrl = {url} onClick={handleClick}/>)}
      </div>
    </>
  )
}

export default App

type CardProps = {
  imageUrl: string;
  onClick: (imageUrl: string) => void
};

function Card({imageUrl, onClick} : CardProps){
  return (
    <div className="card">
      <img src = {imageUrl} onClick={() => onClick(imageUrl)}/>
    </div>
  )
}
