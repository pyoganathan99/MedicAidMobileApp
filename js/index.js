data = _.shuffle(data);

var textArray = data.map(obj => obj.text);

var dictionary = extractDictionary(textArray);

var net = new brain.NeuralNetwork();

var trainingData = data.map((obj) => {

    var input = bow(obj.text,dictionary);

    var output={};
    output[obj.class]=1;

    return {
        input: input,
        output: output
    }

});

net.train(trainingData,{errorThresh: 0.05});

function likely(obj){
    var max=0,maxKey;
    for(var key in obj){
        var val = obj[key];

        if(val>max){
            max=val;
            maxKey=key;
        }
    }

    return(maxKey);
}
