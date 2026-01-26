import ticTac from '../assets/audios/src_assets_audios_tic_tac_planeta_miller.mp3';

export function loadbeeb() {
    const audio = new Audio(ticTac);
    audio.load();

    return () => {
        audio.currentTime = 0;
        audio.play();
    };
}
