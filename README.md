![Untitled (1000 × 300 px)](https://github.com/oslabs-beta/kaptn/assets/119518056/41f21e71-7ffc-4337-8c22-5364a17b87e0)

<div align='center'>

## Built With

![JavaScript](https://img.shields.io/badge/-javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-react-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node](https://img.shields.io/badge/-node-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Electron](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-326ce5.svg?&style=for-the-badge&logo=kubernetes&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F2F4F9?style=for-the-badge&logo=grafana&logoColor=orange&labelColor=F2F4F9)
![Prometheus](https://img.shields.io/badge/Prometheus-000000?style=for-the-badge&logo=prometheus&labelColor=000000)
![Helm](https://img.shields.io/badge/Helm-0F1689?style=for-the-badge&logo=Helm&labelColor=0F1689)
![MUI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

</div>

# kaptn

Kaptn is a fully downloadable desktop application that provides a user-friendly interface for developers to interact with Kubernetes. With the Kaptn Krane Cluster Manager, our supercharged CLI with pre-selected kubectl options and the ability to free-type commands, and our Easy Setup and Cluster Metrics Visualizer, Kaptn provides all the tools you need, whether it's to manage your clusters, or to gain familiarity and proficiency in K8s.

## Features

- Kaptn Krane Cluster Manager - NEW!
  - View live and historical metrics, and refresh stats at adjustable intervals
  - Scale, delete/restart, and rollback deployments, nodes, and pods
  - View logs, yamls, and describe resources
  - Intuitive UI including custom speedometer-style gauges for CPU and Memory Usage, visx graphs, and one-click control of your clusters
  - Filter and sort resources by namespace, max CPU and memory, and more.
- User-friendly terminal interface
  - Take command of the command line interface with pre-selected kubectl options, or free-type
  - Clearly visualize the commands within our interactive terminal
- Quick kubernetes setup
  - Personalized YAML file creator
  - Ability to choose or create new image
- Cluster metrics visualization
  - Kubernetes API server metrics
  - Connect with Grafana and Prometheus to monitor cluster health
- Troubleshoot any confusion with the Instant Help Desk
- Follow tutorials and master K8s with our Learning Center

## Updates


Version 2.0.1 -

- Adds interactive, expandable visx graphs for pods' and nodes' historical cpu and memory usage.

- Adds variable refresh rate.

- Adds various other bugs fixes and additions including: Fixes bug with user directory in CLI

For details on all previous updates and releases, please see the [CHANGELOG](https://github.com/oslabs-beta/kaptn/blob/main/CHANGELOG.md), or [Releases](https://github.com/oslabs-beta/kaptn/releases) page.

#

## Getting Started

1. Download the latest release [here](https://github.com/oslabs-beta/kaptn/releases).


__For Windows (portable):__ Open the .exe file.

__For Linux (AppImage):__ Follow the instructions [here](https://docs.appimage.org/introduction/quickstart.html) to run the application.

__For Mac (Intel/x64/Univeresal):__ Double-click the installer and drag and drop Kaptn in your Applications folder. If you get a warning that the app is from an unidentified developer, go to System Preferences > Security & Privacy > General and click "Open Anyway".

__For Mac with Apple Silicon__: We do not have Mac code-signing, and therefore cannot offically offer an Apple Silicon/ARM64 version for download here. However, we do have a work-around:

First fork/clone the project. Then open a terminal in the project, and run:

    npm i

After that, run:

    npm run build:mac

After completion, the .dmg file will be available in the "dist" folder. If you get a warning that the app is from an unidentified developer, go to System Preferences > Security & Privacy > General and click "Open Anyway".

#

## Usage Guidelines

### Overview

Our application defaults to start page, where you will be able to choose which page you'd like to visit.

![newStartPage](https://github.com/oslabs-beta/kaptn/assets/119518056/a2d473da-37a9-4b6d-b69d-f8fcd95f2b41)

### Krane Cluster Manager

Our all-new Krane Cluster Manager allows you to control your clusters at the click of a button. Simply choose "Nodes & Pods" or "Deployments" at the top of the screen, and you'll have the following options:

- Nodes:
    - View Live CPU and Memory Use
    - View Graphs of Historical CPU and Memory Use
    - View Node Yaml
    - Decribe Node 
    - Drain Node
    - Cordon Node
    - Uncordon Node
    - Delete / Restart Node

- Pods:
    - View Live CPU and Memory Use
    - View Graphs of Historical CPU and Memory Use
    - View Pod Logs
    - View Pod Yaml
    - Decribe Pod
    - Delete / Restart Pod

![v201screencaps-nodesPods](https://github.com/oslabs-beta/kaptn/assets/119518056/60f19526-8c79-40c9-9a8c-000d38240dc6)


- Deployments:
    - View ReplicaSets and Statuses
    - View Deployment Yaml
    - View Deployment Logs
    - Describe Deployment
    - View Rollout Status
    - View Rollout History
    - Rollback to Previous Version
    - Perform Rolling Restart
    - Scale Deployment
    - Delete Deployment

![v201screencaps-Deploys](https://github.com/oslabs-beta/kaptn/assets/119518056/33a362be-1be1-404e-9018-a3599735b9c7)

### Supercharged CLI

You can choose from the pre-suggested commands—including kubectl—to manage your kubernetes clusters or free-type in the command line interface. You can click on the ‘run’ button to run your command, or the ‘clear’ button to wipe the command line. Take advantage of the instant help desk to get more info about any command or type without leaving the command line, and losing the code you've already written.

![dashboardnew](https://github.com/oslabs-beta/kaptn/assets/119518056/fc791173-c81b-4e82-a68e-3a2731933c52)

### Easy Setup

1. Open up docker
2. Open up a terminal
3. Choose Image

   - Before you begin to configure your docker and kubernetes, you will need a docker image. You may create your own docker image by defining that image in a dockerfile. For the purposes of this tutorial, however, select an existing image from an online registry, such as dockerhub
   - Navigate to (https://hub.docker.com) on your browser and create an account / sign in
   - Upon entering the dockerhub dashboard, use the search bar or the explore page to look up an image
   - After selecting an image, click on 'Tags' to view all tag labels attached
   - In the terminal you opened up in step 2, run docker pull <imagename:tagname>
   - Type out the full image name with the tag into the Image Input Field and press the Enter key
   - You may move onto step 4 once you see the image name render on the screen

   ![chooseimage (1)](https://user-images.githubusercontent.com/63977843/236069404-e474bd34-4fa5-4503-84b7-bc4956335eda.gif)
   ![enterimg (1)](https://user-images.githubusercontent.com/63977843/236068711-3bacf6d2-a42a-49a3-9621-e0135e1a0357.gif)

4. Choose Working Directory

   - Select the working directory from which the virtual command line interface will be launched

   ![cwd](https://user-images.githubusercontent.com/63977843/236047939-11ebcf22-5e44-422b-9f94-fafd4d22c6d9.gif)

5. Create .YAML File

   - Click on the CREATE .YAML FILE button, which will open up a page for you to set up your yaml file
   - Using the interactive .yaml generator, configure your file accordingly (e.g. deployment, deployment strategy, volume, DNS). You will be able to preview your code on the right side of the page as you make changes
   - Once complete, copy the yaml file by clicking the Copy to Clipboard button in the top right corner
   - Paste your code into the Name input field in the following format and press enter or click run:
     echo ‘YOUR CODE’ > FILENAME.yaml
   - Use your OS finder / files to locate the yaml file you created and confirm that it is configured as you expect

   ![configyaml (2)](https://user-images.githubusercontent.com/63977843/236071323-57b395df-0128-40e4-b6e0-a060adcea78b.gif)
   ![touchyaml](https://user-images.githubusercontent.com/63977843/236071893-708850e9-d03c-47d0-a5a5-9a1f8efa55a0.gif)

6. Congratulations! You have successfully setup your Kubernetes cluster!

### Metrics

The metrics section is made up of various grafana dashboards to monitor different aspects of your Kubernetes clusters, including:

- Kubernetes API server: API server request rates/latencies, workqueue latencies, and etcd cache hit rate
  ![Screen Shot 2023-04-19 at 8 30 55 PM](https://user-images.githubusercontent.com/121407046/233463294-1ac4b9f4-12a6-467c-b4ff-5af227d7c6f6.png)

## Contributing

### How to contribute

Contributions are an incredibly important part of the open source community. Any contributions you make are greatly appreciated!

- Fork the project
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a pull request (from feature/AmazingFeature to dev)
- Create a new issue on GitHub

## Publications

Check out our Medium article [here](https://medium.com/@kaptnapp/introducing-kaptn-8c4348c6dcf6).

## Contributors

- Brecht Horn [GitHub](https://github.com/brecht-horn) | [LinkedIn](https://www.linkedin.com/in/brecht-horn-a9b839213/)
- John Choi [GitHub](https://github.com/jhwiwonc) | [LinkedIn](https://www.linkedin.com/in/hwi-won-choi-057081191/)
- Natalie Cordoves [GitHub](https://github.com/ncordoves) | [LinkedIn](https://www.linkedin.com/in/natalie-cordoves)
- Olivia Hodel [GitHub](https://github.com/ohodel) | [LinkedIn](https://www.linkedin.com/in/olivia-hodel/)
- Yining Wang [GitHub](https://github.com/yiningcw) | [LinkedIn](https://www.linkedin.com/in/yining-wang-83b896108/)

## License

Distributed under the MIT License. See LICENSE for more information.

Give this project a ⭐️ if it helped you!

![Untitled (1000 × 300 px) (1)](https://user-images.githubusercontent.com/106838422/235518916-ddc0d40b-fe19-41c9-b43b-ac34894d52b1.png)
