import * as p5 from 'p5';
import * as sound from 'p5/lib/addons/p5.dom';
import './style.css';
import '../node_modules/github-fork-ribbon-css/gh-fork-ribbon.css';
import { saveAs } from 'file-saver';


new p5((s) => {


    let fpsParagraph;
    let resolution;
    let flying = 0;
    let save = false;
    let rotation;
    let terrain;
    let offset;
    let range
    const slidersResolution = 300;
    let rotationSlider;
    let rangeSlider;
    let offestSlider;
    let resolutionSlider;
    let lastSliderX = 10;

    s.keyPressed = () => {
        if (s.keyCode === 73) { //I
            save = true;
        }
    }

    let parameters = () => {
        rotation = s.map(rotationSlider.value(), 1, 100, 0.2, 0.4);
        range = rangeSlider.value();
        offset = s.map(offestSlider.value(), 1, 100, 0.01, 0.3);
        resolution = resolutionSlider.value();

        if (terrain === undefined || terrain.length !== resolution) {
            terrain = [];
            //init terrain z
            for (let y = 0; y < resolution; y++) {
                let row = [];
                for (let x = 0; x < resolution; x++) {
                    row.push(0);
                }
                terrain.push(row);
            }
        }
    }

    let createSlider = (initialValue, min, max) => {
        let result = s.createSlider(min,  max, initialValue);
        result.position(lastSliderX, 10);
        lastSliderX += 160;
        result.style('width', '150px');
        return result;
    }

    s.setup = () => {
        let canvas = s.createCanvas(window.innerWidth - 8, window.innerHeight - 50, s.WEBGL);
        canvas.parent('sketch-holder');

        rangeSlider = createSlider(100, 0, 200);
        rotationSlider = createSlider(s.map(0.30, 0.2, 0.4, 1, 100), 1, 100);
        offestSlider = createSlider(s.map(0.1, 0.01, 0.3, 1, 100), 1, 100);
        resolutionSlider = createSlider(80, 1, 200);


        fpsParagraph = s.createP('FPS');

        parameters();


    };


    s.draw = () => {
        parameters();

        flying -= 0.01;

        let yoff = flying;
        for (let y = 0; y < resolution; y++) {
            let xoff = 0;
            for (let x = 0; x < resolution; x++) {
                terrain[x][y] = s.map(s.noise(xoff, yoff), 0, 1, -range, range);
                xoff += offset;
            }
            yoff += offset;
        }


        //reset
        s.background(255);

        s.translate(-s.width / 2 + s.width / 45, -s.height / 2 + s.height / 5.5);
        s.rotateX(rotation * s.PI);
        s.fill(255);
        s.stroke(0);

        let vWidth = s.width - 10;
        let vHeight = s.height - 10;

        for (let y = 0; y < resolution; y++) {
            s.beginShape(s.TRIANGLE_STRIP);
            for (let x = 0; x < resolution; x++) {
                let px0 = x * vWidth / resolution + 5;
                let py0 = y * vHeight / resolution;
                let py1 = (y + 1) * vHeight / resolution;
                s.vertex(px0, py0, terrain[x][y]);
                s.vertex(px0, py1, terrain[x][y + 1]);
            }
            s.endShape();
        }


        fpsParagraph.html('FPS ' + s.frameRate().toFixed(2));

        if (save) {
            save = false;
            let canvas = document.getElementsByTagName('canvas')[0];
            canvas.toBlob(function (blob) {
                saveAs(blob, "sketch.png");
            });
        }


    };
});

