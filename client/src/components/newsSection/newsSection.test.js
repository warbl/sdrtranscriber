import { render, screen, act } from '@testing-library/react';
import axios from 'axios';
import NewsSection from './newsSection';

jest.mock('axios');

test('renders news content', async () => {
    axios.get.mockResolvedValue({
        data: [
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
        ],
    });

    await act( async () => render(<NewsSection/>));

    const newsTitle =  screen.getByTestId("news-title");
    const newsTimeStamp =  screen.getByTestId("news-timestamp");
    const newsContent =  screen.getByTestId("news-content");

    expect(newsTitle).toBeInTheDocument();
    expect(newsTitle).toHaveTextContent("Here is the Transcribed News Report from KYW NEWS");

    //should have the latest time_of_broadcast as the time stamp on the website page
    expect(newsTimeStamp).toBeInTheDocument();
    expect(newsTimeStamp).toHaveTextContent("(last updated: Mon Apr 26 2021 at 10:45am)");

    expect(newsContent).toBeInTheDocument();
    expect(newsContent).toHaveTextContent("This is me testing the news section of the website.");

});