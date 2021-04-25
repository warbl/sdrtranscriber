import { render, screen } from '@testing-library/react';
import NewsModal from './newsModal';

const data = [
    { time_of_broadcast: "2021-04-26T10:00:00" , transcribed_speech: "This is me" },
    { time_of_broadcast: "2021-04-26T10:05:00" , transcribed_speech: "testing" },
    { time_of_broadcast: "2021-04-26T10:10:00" , transcribed_speech: "the news" },
    { time_of_broadcast: "2021-04-26T10:15:00" , transcribed_speech: "section of the" },
    { time_of_broadcast: "2021-04-26T10:20:00" , transcribed_speech: "website." },
    { time_of_broadcast: "2021-04-26T10:25:00" , transcribed_speech: "This" },
    { time_of_broadcast: "2021-04-26T10:30:00" , transcribed_speech: "is more" },
    { time_of_broadcast: "2021-04-26T10:35:00" , transcribed_speech: "content" },
    { time_of_broadcast: "2021-04-26T10:40:00" , transcribed_speech: "for testing" },
    { time_of_broadcast: "2021-04-26T10:45:00" , transcribed_speech: "purposes." },
];

test('renders news modal content', async () => {
    render(<NewsModal newsContent={data} handleClick={() => {}} />);
    //checking if news modal title renders
    const newsModalTitle =  screen.getByText("All News");
    expect(newsModalTitle).toBeInTheDocument();
    //checking if news modal content 1 renders
    const newsModalContent1 = screen.getByTestId("popup-news-content-0");
    expect(newsModalContent1).toBeInTheDocument();
    expect(newsModalContent1).toHaveTextContent("This is me testing the news section of the website");
    //checking if news modal content 2 renders
    const newsModalContent2 = screen.getByTestId("popup-news-content-1");
    expect(newsModalContent2).toBeInTheDocument();
    expect(newsModalContent2).toHaveTextContent("This is more content for testing purposes");

});