
var data;
var input;
var enableRenderPC = false;
function handleFileSelect(evt) 
{
    var file = evt.target.files[0];
    if (file != null) 
    {
        Papa.parse(file, { header: true,
                           dynamicTyping: true,
                           complete: function(results) 
                           {
                               data = results.data;
                               cancelAnimationFrame(PCAnimationFrame);
                               $("#container").empty();
                               $("#RenderPC").toggleClass("disabled",enableRenderPC);
                               enableRenderPC = true;
                           }
        });
    }
}

/* Check if url is valid or not */
function ValidURL(str) 
{
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                             '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                             '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                             '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                             '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                             '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    if(!pattern.test(str)) 
    {
      return false;
    }
    else 
    {
      return true;
    }
}

function handleFilePathURL(url) 
{
    Papa.parse(url, { download: true,
                      header: true,
                      dynamicTyping: true,
                      complete: function(results) 
                      {
                          data = results.data;
                          console.log(data);
                          cancelAnimationFrame(animationFrame);
                          $("#container").empty();
                          init();                
                      }
                    });
}
