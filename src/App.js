import React, { Component } from 'react';
import $ from 'jquery';
import './App.css';
import Tombstone from "./Tombstone.js"
import Dashboard from "./Dashboard.js"
import Button from "./Button.js"

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {flipped: false, currentRun: Date.now()};
    $("body").on('touchmove',function(event){
      event.preventDefault();
      return false;
    });
    $("body").on('selectstart',function(event){
      event.preventDefault();
      return false;
    });
  }

  resetDashboard() {
    this.setState({currentRun: Date.now()});
  }

  spin(e) {
    if(this.state.flipped){
      $('.App').css("transform", "rotateY(0deg)")
    }
    else {
      $('.App').css("transform", "rotateY(180deg)")
      this.resetDashboard();
    }
    this.setState({flipped: !this.state.flipped});
  }

  render() {

    let objectData = [
      {
        startYear: 1616,
        momentYear: 1927,
        artist: "Frans Hals",
        nationality: "Dutch",
        life_dates: "1581-1585–08/29/1666",
        title: "Pieter Cornelisz. van der Morsch",
        creation_date: "1616",
        medium: "oil on canvas, transferred from panel",
        credit_line: "Acquired through the generosity of Mrs. Alan M. Scaife.",
        accession_number: "61.42.2",
        story: `In the 17th century, Dutch artists often painted on wooden panels even though painting on canvas had become popular elsewhere nearly a century earlier. When the British art dealer Sir Joseph Duveen purchased this Hals portrait from Lord Northbrook in 1927 it was still on its original panel support. By the time he sold it to the American advertising pioneer Alfred W. Erickson in 1929, it had been transferred to canvas. Such transfer, usually to stabilize a painting, is a painstaking process. It involves gradually shaving off the damaged, cracked, or infested panel and attaching the resulting thin paint layer to a specially prepared canvas. The process was used extensively in the 19th century, but it has since been largely supplanted by less severe methods of conservation.`,
        chat: `Frans Hals’s portraiture is distinguished by dazzling brushwork and penetrating analysis of character. Hals received numerous commissions for both individual and group portraits, even though his style of visible brushstrokes differed from prevailing norms in Dutch painting at the time. In the 19th century, with the advent of the Impressionist movement, Hals’s mastery was recognized anew.\nHals’s style is well-suited for a portrait of Pieter Cornelisz. van der Morsch, a court officer of Leiden and a member of the Chamber of Rhetoric, the city’s amateur literary club. Details in the painting refer to van der Morsch's role in the club, which composed poetry and staged satirical plays. The dried herring he holds refers to the phrase “to give a red herring,” Dutch slang for rebuking someone with sarcastic remarks. The animated pose and expression convey van der Morsch’s lively character, while the slogan at the upper left, Wie begeert (“Who wants it?”), suggests his wit.`
      },
      {
        startYear: 1520,
        momentYear: 1889,
        artist: "Adrien Ysenbrandt",
        nationality: "Netherlandish",
        life_dates: "active by 1510–1551",
        title: "Vision of Saint Ildephonsus",
        creation_date: "ca. 1520–1550",
        medium: "oil on panel",
        credit_line: "Bequest of Howard A. Noble.",
        accession_number: "64.11.15",
        chat: `Artistic portrayals of Saint Ildephonsus, the seventh-century theologian and Bishop of Toledo, mainly depict his vision of the Virgin Mary, who appeared to him while he was praying in church. In thanks for his zealous devotion, she gifted him a priestly vestment. Most of these depictions are by Spanish artists.\nIt is not surprising, though, that Adrian Ysenbrandt, a Netherlandish artist, would have also taken on this essentially Spanish subject. During this period, large parts of Europe, including what is now the Netherlands, Belgium, and Spain were under the rule of Holy Roman Emperor Charles V, and artistic trade within the empire was common. Indeed, documentary evidence shows that Ysenbrandt shipped paintings to Spain, suggesting that he worked not only for the local market but also for the export trade.`,
        story: `To succeed in uncovering the life stories of artworks, a provenance researcher must be an art-history detective: diligent, methodical, and lucky. With works for which alternate versions or copies exist, the process is especially complicated. For example, the 1889 Northbrook collection catalogue lists a painting of the vision of Saint Ildephonsus while noting that there was “a similar picture, in 1860” in another British collection. Which version is the one that you see here? Together with other research, we uncovered physical evidence that this is the Northbrook painting. The key was comparing an illustration of the  painting in a 1927 exhibition catalogue at London’s Royal Academy with an archival photograph of the museum’s painting before restoration: both indicate an identical narrow crack on the panel’s left side.`
      },
      {
        startYear: 1520,
        momentYear: 1807,
        artist: "Attributed to Domenico Puligo",
        nationality: "Italian",
        life_dates: "1492–1527",
        title: "Portrait of a Young Man",
        creation_date: "early 16th century",
        medium: "oil on panel",
        credit_line: "Bequest of Howard A. Noble.",
        accession_number: "64.11.13",
        chat: `By the early 16th century, portraiture had become a popular and widely practiced art form in Florence and other parts of Europe. For the aristocracy and other elite members of society, portraiture was, in part, a way to showcase status but also an attempt to attain a form of individual immortality.\nThat desire for legacy is ironic in this case, since the identities of both the sitter and the artist are lost to history. Because the portrait was once in the Medici collection in Florence, the sitter has been reported to be a member of that family. But his identity remains elusive. And, based on style and composition, the portrait could be the work of several illustrious Florentine artists of the period. Attribution to Domenico Puligo originated with noted art historian Bernard Berenson.`,
        story: `Scholarly opinions about the age and place of creation of this fine portrait—Renaissance Florence—have not changed in its more than 200-year documented history. The portrait is unsigned, however, and experts have differed in their opinions about who painted it.\nFrench art dealer Le Brun, who purchased the portrait around 1807, considered it a work of Renaissance master Raphael. The German art historian Waagen, however, commenting on pictures in the Northbrook collection, questioned that attribution and assigned it to Florentine artist, Pontormo. Still later, Italian expert Frizzoni ascribed it to Andrea del Sarto. In 1896, influential American art historian Bernard Berenson thought that it was painted by Franciabigio, before settling on the presently accepted attribution to Domenico Puligo some 50 years later.`      }
    ]

    let spin = this.spin.bind(this);
    let resetDashboard = this.resetDashboard.bind(this);
    let currentObject = Number(location.search.replace("?object=","")) || 1;
    currentObject = currentObject - 1;

    let formattedChat = objectData[currentObject].chat.replace("\n","</p></p>")
    let formattedStory = objectData[currentObject].story.replace("\n","</p></p>")
    return (
      <div className="App">
        <section className="front">
          <div className="content">
            <Tombstone data={objectData[currentObject]}/>
            <p dangerouslySetInnerHTML={{__html: formattedChat}}></p>
          </div>
          <footer>
            <Button text='Where has this painting been?' cta='Touch here to find out!' touchEvent={this.spin.bind(this)}/>
          </footer>
        </section>
        <section className="back">
          <div className="content">
            <Tombstone data={objectData[currentObject]} />
            <Dashboard objectData={objectData[currentObject]} key={this.state.currentRun} />
            <h2>★ A Moment in History:  {objectData[currentObject].momentYear}</h2>
            <p dangerouslySetInnerHTML={{__html: formattedStory}}></p>
          </div>
          <footer>
            <Button text='Replay' cta='Touch Here.' size="half" touchEvent={resetDashboard}/>
            <Button text='Go Back' cta='Touch Here.' size="half" touchEvent={spin}/>
          </footer>
        </section>
      </div>
    );
  }
}

export default App;
