// S1 - to process only the first segment deliminted by any symbol
//       if there is enough sound fetched
// S2 - handle for "'"" <- posophy is valid in name (-26)
// Credit to codedrome (2019,Nov). The Soundex Algorithm in JavaScript. https://www.codedrome.com/the-soundex-algorithm-in-javascript/ 
function soundex(name)
{ 
  if (name==''||name== undefined) return;
    let s = [];
    let si = 1;
    let c;

    //              ABCDEFGHIJKLMNOPQRSTUVWXYZ
    let mappings = "01230120022455012623010202";

    s[0] = name[0].toUpperCase();
    for(let i = 1, l = name.length; i < l; i++)
    {
        c = (name[i].toUpperCase()).charCodeAt(0) - 65;
        // Logger.log(c+":"+name[i]+":"+si)
 
        if(c >= 0 && c <= 25 )
        {
            if(mappings[c] != '0')
            {
                if(mappings[c] != s[si-1])
                {
                    s[si] = mappings[c];
                    si++;
                }

                if(si > 3)
                {
                    break;
                }
            }
        }
        else if(si > 2 && c!=-26) //{S1,S2}
                 break;
    }

    if(si <= 3)
    {
        while(si <= 3)
        {
            s[si] = '0';
            si++;
        }
    }
    
    return s.join("");
}