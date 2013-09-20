-module(news_page_handler).
-author("shree@ybrantdigital.com").

-export([init/3]).

-export([content_types_provided/2]).
-export([welcome/2]).
-export([terminate/3]).

%% Init
init(_Transport, _Req, []) ->
	{upgrade, protocol, cowboy_rest}.

%% Callbacks
content_types_provided(Req, State) ->
	{[		
		{<<"text/html">>, welcome}	
	], Req, State}.

terminate(_Reason, _Req, _State) ->
	ok.

%% API
welcome(Req, State) ->
	{[{Name,Value}], Req2} = cowboy_req:bindings(Req),
	
	Url = string:concat("http://couchdb.speakglobally.net/wildridge/", binary_to_list(Value)),
	%Url2 = string:concat("http://localhost:5984/speakglobally/_design/bump/_update/views_counter/", binary_to_list(Value)),
	{ok, "200", _, Response} = ibrowse:send_req(Url,[],get,[],[]),
	%{ok, "201",_,_} = ibrowse:send_req(Url2,[],put, [],[]),
	Res = string:sub_string(Response, 1, string:len(Response) -1 ),
	Params = jsx:decode(list_to_binary(Res)),
	{ok, Body} = news_page_dtl:render(Params),
	Headers = [{<<"Content-Type">>, <<"text/html">>}],
    {ok, Resp} = cowboy_req:reply(200, Headers, Body, Req),
    {true, Resp, State}.


