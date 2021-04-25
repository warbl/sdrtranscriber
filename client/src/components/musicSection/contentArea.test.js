import { render, screen, act } from '@testing-library/react';
import axios from 'axios';
import ContentArea from './contentArea';

jest.mock('axios');

const station = {
    station_id: "1",
    station_name: "TEST",
    station_freq: "100.0",
    music_genre: "classical",
    music_img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg",
}

test('renders correct song content for station', async () => {
    axios.get.mockResolvedValue({
        data: [
            { song_id: 1, song_name: "song name 1", song_artist: "song artist 1", station_freq: "station 1", album_cover: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg", yt_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", time_played: "2021-04-26T10:00:00"},
            { song_id: 2, song_name: "song name 2", song_artist: "song artist 2", station_freq: "station 2", album_cover: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg", yt_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", time_played: "2021-04-26T10:10:00" },
            { song_id: 3, song_name: "song name 3", song_artist: "song artist 3", station_freq: "station 3", album_cover: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg", yt_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", time_played: "2021-04-26T10:20:00" },
        ],
    });

    await act( async () => render(<ContentArea station={station} />));

    //checking for content area header
    const heading = screen.getByTestId("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("TEST - 100.0 SET LIST");

    //checking if first music content renders and is correct
    const id0 =  screen.getByTestId("song_id_0");
    const name0 =  screen.getByTestId("song_name_0");
    const artist0 =  screen.getByTestId("song_artist_0");
    const album0 = screen.getByTestId("album_cover_0");
    const time0 = screen.getByTestId("time_played_0");
    const yt_link0 =  screen.getByTestId("yt_link_0");
    expect(id0).toBeInTheDocument();
    expect(album0).toBeInTheDocument();
    expect(yt_link0).toBeInTheDocument();
    expect(name0).toBeInTheDocument();
    expect(name0).toHaveTextContent("song name 1");
    expect(artist0).toBeInTheDocument();
    expect(artist0).toHaveTextContent("song artist 1");
    expect(time0).toBeInTheDocument();
    expect(time0).toHaveTextContent("Played on: Mon Apr 26 2021 at 10:00am");

    //checking if second music content renders and is correct
    const id1 =  screen.getByTestId("song_id_1");
    const name1 =  screen.getByTestId("song_name_1");
    const artist1 =  screen.getByTestId("song_artist_1");
    const album1 = screen.getByTestId("album_cover_1");
    const time1 = screen.getByTestId("time_played_1")
    const yt_link1 =  screen.getByTestId("yt_link_1");
    expect(id1).toBeInTheDocument();
    expect(album1).toBeInTheDocument();
    expect(yt_link1).toBeInTheDocument();
    expect(name1).toBeInTheDocument();
    expect(name1).toHaveTextContent("song name 2")
    expect(artist1).toBeInTheDocument();
    expect(artist1).toHaveTextContent("song artist 2");
    expect(time1).toBeInTheDocument();
    expect(time1).toHaveTextContent("Played on: Mon Apr 26 2021 at 10:10am");

    //checking if third music content renders and is correct
    const id2 =  screen.getByTestId("song_id_2");
    const name2 =  screen.getByTestId("song_name_2");
    const artist2 =  screen.getByTestId("song_artist_2");
    const album2 = screen.getByTestId("album_cover_2");
    const time2 = screen.getByTestId("time_played_2")
    const yt_link2 =  screen.getByTestId("yt_link_2");
    expect(id2).toBeInTheDocument();
    expect(album2).toBeInTheDocument();
    expect(yt_link2).toBeInTheDocument();
    expect(name2).toBeInTheDocument();
    expect(name2).toHaveTextContent("song name 3");
    expect(artist2).toBeInTheDocument();
    expect(artist2).toHaveTextContent("song artist 3");
    expect(time2).toBeInTheDocument();
    expect(time2).toHaveTextContent("Played on: Mon Apr 26 2021 at 10:20am");

});