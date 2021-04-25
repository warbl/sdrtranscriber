import { render, screen, act } from '@testing-library/react';
import axios from 'axios';
import Radio from './radio';

jest.mock('axios');

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ''
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faSpinner: '',
    faBars: '',
    faBroadcastTower: ''
}));

xtest('renders radio page content', async () => {
    axios.get.mockResolvedValue({
        data: [
            { station_id: 1, station_name: "station name 1", station_freq: "station 1", music_img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg" },
            { station_id: 2, station_name: "station name 2", station_freq: "station 2", music_img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg" },
            { station_id: 3, station_name: "station name 3", station_freq: "station 3", music_img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Mr._Smiley_Face.svg" },
        ],
    });

    await act( async () => render(<Radio/>));

    //checking if first station renders
    const station0 =  screen.getByTestId("station_0");
    const info0 =  screen.getByTestId("station_info_0");
    const img0 =  screen.getByTestId("station_img_0");
    expect(station0).toBeInTheDocument();
    expect(info0).toBeInTheDocument();
    expect(img0).toBeInTheDocument();

    //checking if second station renders
    const station1 =  screen.getByTestId("station_1");
    const info1 =  screen.getByTestId("station_info_1");
    const img1 =  screen.getByTestId("station_img_1");
    expect(station1).toBeInTheDocument();
    expect(info1).toBeInTheDocument();
    expect(img1).toBeInTheDocument();

    //checking if third station renders
    const station2 =  screen.getByTestId("station_2");
    const info2 =  screen.getByTestId("station_info_2");
    const img2 =  screen.getByTestId("station_img_2");
    expect(station2).toBeInTheDocument();
    expect(info2).toBeInTheDocument();
    expect(img2).toBeInTheDocument();

});