-module(news_count_by_category_handler).
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
		{<<"application/json">>, welcome}	
	], Req, State}.

terminate(_Reason, _Req, _State) ->
	ok.

%% API
welcome(Req, State) ->
	%{[{Name,Value}], Req2} = cowboy_req:bindings(Req),
	{Category, _} = cowboy_req:qs_val(<<"c">>, Req),
	lager:info("Get total number of News items by category~p", [binary_to_list(Category)]),
	Url = case binary_to_list(Category) of 
		"World" ->
			%Category = "US",
			enutv_util:news_count("world_news");
		"US" ->
			%Category = "US",
			enutv_util:news_count("us_news");
			
		"Politics" ->
			%Category = "Politics",
			enutv_util:news_count("us_politics");
			
		"Entertainment" ->
			%Category = "Entertainment",
			enutv_util:news_count("us_entertainment");
		
		"Markets" ->
			%Category = "Entertainment",
			enutv_util:news_count("us_markets");			

		"Money" ->
			%Category = "Entertainment",
			enutv_util:news_count("us_money");			
		_ ->

			%Category = "None",
			lager:info("#########################None")

	end,
	{ok, "200", _, Response} = ibrowse:send_req(Url,[],get,[],[]),
	Res = string:sub_string(Response, 1, string:len(Response) -1 ),
	Body = list_to_binary(Res),
	{Body, Req, State}.


