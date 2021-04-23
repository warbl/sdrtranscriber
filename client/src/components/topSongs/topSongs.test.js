import { render, screen, act } from '@testing-library/react';
import axios from 'axios';
import TopSongs from './topSongs';

jest.mock('axios');

test('renders top songs page content', async () => {
    axios.get.mockResolvedValue({
        data: [
            { song_id: 1, song_name: "song name 1", song_artist: "song artist 1", station_freq: "station 1", album_cover: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg", yt_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
            { song_id: 2, song_name: "song name 2", song_artist: "song artist 2", station_freq: "station 2", album_cover: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg", yt_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
            { song_id: 3, song_name: "song name 3", song_artist: "song artist 3", station_freq: "station 3", album_cover: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg", yt_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        ],
    });

    await act( async () => render(<TopSongs/>));

    //checking if first music content renders and is correct
    const id0 =  screen.getByTestId("song_id_0");
    const name0 =  screen.getByTestId("song_name_0");
    const artist0 =  screen.getByTestId("song_artist_0");
    const station0 =  screen.getByTestId("station_freq_0");
    const album0 = screen.getByTestId("album_cover_0")
    const yt_link0 =  screen.getByTestId("yt_link_0");
    expect(id0).toBeInTheDocument();
    expect(album0).toBeInTheDocument();
    expect(yt_link0).toBeInTheDocument();
    expect(name0).toBeInTheDocument();
    expect(name0).toHaveTextContent("song name 1");
    expect(artist0).toBeInTheDocument();
    expect(artist0).toHaveTextContent("song artist 1");
    expect(station0).toBeInTheDocument();
    expect(station0).toHaveTextContent("station 1");

    //checking if second music content renders and is correct
    const id1 =  screen.getByTestId("song_id_1");
    const name1 =  screen.getByTestId("song_name_1");
    const artist1 =  screen.getByTestId("song_artist_1");
    const station1 =  screen.getByTestId("station_freq_1");
    const album1 = screen.getByTestId("album_cover_1");
    const yt_link1 =  screen.getByTestId("yt_link_1");
    expect(id1).toBeInTheDocument();
    expect(album1).toBeInTheDocument();
    expect(yt_link1).toBeInTheDocument();
    expect(name1).toBeInTheDocument();
    expect(name1).toHaveTextContent("song name 2")
    expect(artist1).toBeInTheDocument();
    expect(artist1).toHaveTextContent("song artist 2");
    expect(station1).toBeInTheDocument();
    expect(station1).toHaveTextContent("station 2");

    //checking if third music content renders and is correct
    const id2 =  screen.getByTestId("song_id_2");
    const name2 =  screen.getByTestId("song_name_2");
    const artist2 =  screen.getByTestId("song_artist_2");
    const station2 =  screen.getByTestId("station_freq_2");
    const album2 = screen.getByTestId("album_cover_2");
    const yt_link2 =  screen.getByTestId("yt_link_2");
    expect(id2).toBeInTheDocument();
    expect(album2).toBeInTheDocument();
    expect(yt_link2).toBeInTheDocument();
    expect(name2).toBeInTheDocument();
    expect(name2).toHaveTextContent("song name 3");
    expect(artist2).toBeInTheDocument();
    expect(artist2).toHaveTextContent("song artist 3");
    expect(station2).toBeInTheDocument();
    expect(station2).toHaveTextContent("station 3");

    

});