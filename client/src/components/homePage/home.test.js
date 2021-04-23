import { render, screen, act } from '@testing-library/react';
import axios from 'axios';
import Home from './home';

jest.mock('axios');

test('renders home page content', async () => {
    axios.get.mockResolvedValue({
        data: [
            { song_name: "test song", song_artist: "test artist", station_freq: "test station", time_played: "2021-04-26T10:00:00" },
        ],
    });
    await act( async () => render(<Home/>));
    const title = screen.getByText('NO RADIO, NO PROBLEM.');
    expect(title).toBeInTheDocument();
    const paragraph = screen.getByText('Enjoy and explore all the content from the radio stations of Philadelphia right here!');
    expect(paragraph).toBeInTheDocument();
    const banner =  screen.getByTestId("banner");
    expect(banner).toBeInTheDocument();
});