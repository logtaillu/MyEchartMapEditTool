let index = 0;
const now = +(new Date());
export default function(){
    return `upload-file-${now}-${++index}`;
}
