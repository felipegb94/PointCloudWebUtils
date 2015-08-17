var headers = ['x','y','z'];
var columnDelimeter = ',';
var lineDelimeter = '\n';
var filename = 'output.csv';

function VerticesToCSV(vertices)
{
    var result = headers.join(columnDelimeter);
    result += lineDelimeter;

    console.log(vertices);
    for(var i = 0; i < vertices.length; i++)
    {
        var vector = vertices[i];
        var point = [vector['x'],vector['y'],vector['z']];
        result += point.join(columnDelimeter);
        result += lineDelimeter;
    }
    
    return result;
}

function DownloadCSV(csvString)
{
    if (!csvString.match(/^data:text\/csv/i)) {
        csvString = 'data:text/csv;charset=utf-8,' + csvString;
    }
    data = encodeURI(csvString);
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
}