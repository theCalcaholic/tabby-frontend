export class HtmlTemplateContainer {
  template2 = {
      parts: [`
        <div id="container">
        <div id="header">
          <div id="topbar">
          </div>
          <div id="titles">
            <div id="monogram">
            </div>
            <div id="title">
            </div>
            <div id="subtitle">
            </div>
          </div>
        </div>
        <div id="content">
        <div class="page" id="menu">
          <center class="page-head">
          <b class='tabheading' id='menuheading'></b><br>
          <i class='tabsubheading' id='menusubheading'></i>
          </center>

          <div id="about-nav">`,
          `</div>
        </div>
        `,
        `</div>
        <div id="footer">
        <b id='playerinfo-title'></b><br>
        <i id="playerinfo-line1">
        </i><br>
        <i id="playerinfo-line2">
        </i>
        </div>
        </div>`],
      tablink_template: `\
        <a href="#\${id}" class='tablink'>\${title}</a>`,
      tab_template: `\
        <div id=\${id} class="page">\${content}
        <a href="#menu" class='homelink'>HOME</a>
        </div>`
    }
}
