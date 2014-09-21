var count = 0; // temporary counter that will bug out on multiple squares. Not an issue when pulling DB info

$('#dropzone').on('drop',function(e){
    // Count is in the transition point for the CSS. Should be modified to DB count. Possible to redefine count.
    var dt=e.originalEvent.dataTransfer||e.dataTransfer;
    var types=dt.types;
    for(var i=0;i<types.length;++i){
    // ----> Return URL called -> "dt.getData(types[i])"
    }
    e.preventDefault();
    e.stopPropagation();
});

$('html').on('dragenter dragover drop',function(e){
    e.preventDefault();
    e.stopPropagation();
});

function drop(ev) {
    count+=1; // also removable counter content
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text/html");
    $(ev.target).remove('.sCount'); // remove the previous count from the stream in case of cache
    $(ev.target).append('<p class="sCount" style="font-size:6.2em;margin-top:-8px;color:#fff;animation: fadein 2s;">'+count+'</p>');
}
