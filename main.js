const electron =require('electron');
const url= require('url');
const path =require('path');

const{app, BrowserWindow, Menu, ipcMain} =electron; //getting the functions from electron

let mainWindow;
let addWindow;

app.on('ready', function(){ //when the app is on, these shows up
    mainWindow=new BrowserWindow({
        webPreferences: {
            nodeIntegration : true
        }
    });
    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,"html",'mainWindow.html'), // "html" shows the folder location 
    protocol:'file:',
    slashes : true
}));
//quit add window when the application is quit
mainWindow.on('closed', function(){
    app.quit();
});

//create menu template
const mainMenu=Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(mainMenu);
});
//adding a sub html page
function createAddWindow(){
   addWindow=new BrowserWindow({
       width: 200,
       height: 300,
       title:'Add Item',
       webPreferences: {
           nodeIntegration : true
       }
   });
   addWindow.loadURL(url.format({
       pathname:path.join(__dirname,"html", 'add.html'),
       protocol:'file',
       slashes:true
   }));
addWindow.on('closed', function(){
addWindow=null;

});
   //garbage collection

}

//catch item:add
ipcMain.on('item:add', function(e, item){
    
   
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})
const mainMenuTemplate=[
    { label: 'File', //create a tab 
    submenu:[
        {
            label: 'Add Item', //create a subtab
            click(){
                createAddWindow();
            }
        },
        {
            label: 'Clear',
            click(){
                mainWindow.webContents.send('item:clear');
            }

            

        },
        {
            label: 'Quit',
            accelerator: process.platform=='darwin' ? 'Command+Q' : 'Ctrl+Q', //shortcut to quit
            click(){
                app.quit();
            }
        }


    ]
    
    }
];
//if mac 
if(process.platform=='darwin'){
    mainMenuTemplate.unshift({});
}

//add developer tools if not in production
if(process.env.NODE_ENV!=='production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[

            {
              label: 'Dev Tools',
              accelerator: process.platform=='darwin' ? 'Command+Q' : 'Ctrl+I', //shortcut to dev tools
           
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();

                }
            },{
                role:'reload'
            }
        ]
    });
}